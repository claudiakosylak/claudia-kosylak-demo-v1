import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { userApi, User } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { formatDate } from '@/lib/utils'
import { Users, UserPlus, Settings } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    recentSignups: [] as User[],
    allUsers: [] as User[],
  })
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const getDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    return user?.email || 'Admin'
  }

  useEffect(() => {
    loadDashboardData()
  }, [currentPage])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Get recent signups (last 5 users from last 24 hours)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      // Get all users for the list (with pagination)
      const usersResponse = await userApi.getUsers({
        page: currentPage,
        page_size: 20,
        sort_by: 'first_name',
        sort_direction: 'asc',
      })

      // Get recent signups - use max page_size of 100 (backend limit)
      const allUsersResponse = await userApi.getUsers({
        page: 1,
        page_size: 100, // Changed from 1000 to 100 (backend max)
        sort_by: 'created_at',
        sort_direction: 'desc',
      })

      const recentSignups = allUsersResponse.users
        .filter((u) => {
          const userCreatedAt = new Date(u.created_at)
          return userCreatedAt > yesterday
        })
        .slice(0, 5)

      setStats({
        totalUsers: allUsersResponse.total,
        recentSignups,
        allUsers: usersResponse.users,
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {getDisplayName()}! Here's your admin overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Signups</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentSignups.length}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button asChild size="sm">
              <Link to="/profile">Manage Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Signups */}
      {stats.recentSignups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
            <CardDescription>
              Users who joined in the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentSignups.map((recentUser) => (
                <div
                  key={recentUser.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {recentUser.first_name && recentUser.last_name
                        ? `${recentUser.first_name} ${recentUser.last_name}`
                        : 'Name not provided'}
                    </p>
                    <p className="text-sm text-muted-foreground">{recentUser.email}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(recentUser.created_at)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Complete list of users (sorted by first name)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.allUsers.map((listUser) => (
              <div
                key={listUser.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">
                    {listUser.first_name && listUser.last_name
                      ? `${listUser.first_name} ${listUser.last_name}`
                      : 'Name not provided'}
                  </p>
                  <p className="text-sm text-muted-foreground">{listUser.email}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    listUser.role === 'admin'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {listUser.role}
                  </span>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(listUser.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {stats.allUsers.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No users found
            </p>
          )}

          {/* Simple pagination info - full pagination can be added later */}
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Showing {stats.allUsers.length} users (Page {currentPage})
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
