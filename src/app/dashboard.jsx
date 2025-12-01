import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CheckCircle,
  Plus,
  Calendar,
  Users,
  Bell,
  LogOut,
  ListTodo,
  BookOpen,
} from "lucide-react-native";
import { useAuth } from "@/utils/auth/useAuth";
import useUser from "@/utils/auth/useUser";
import { useRouter } from "expo-router";

export default function DashboardPage() {
  const insets = useSafeAreaInsets();
  const { signOut, isAuthenticated, isReady } = useAuth();
  const { data: user, loading: userLoading } = useUser();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/");
    }
  }, [isReady, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [
        profileRes,
        tasksRes,
        assignmentsRes,
        groupsRes,
        notificationsRes,
      ] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/tasks"),
        fetch("/api/assignments"),
        fetch("/api/groups"),
        fetch("/api/notifications?unread=true"),
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData.user);
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks || []);
      }

      if (assignmentsRes.ok) {
        const assignmentsData = await assignmentsRes.json();
        setAssignments(assignmentsData.assignments || []);
      }

      if (groupsRes.ok) {
        const groupsData = await groupsRes.json();
        setGroups(groupsData.groups || []);
      }

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        setNotifications(notificationsData.notifications || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSignOut = () => {
    signOut();
  };

  const toggleTaskComplete = async (taskId, completed) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  if (userLoading || loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fafc",
          paddingTop: insets.top,
        }}
      >
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={{ marginTop: 16, color: "#6b7280" }}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  const upcomingTasks = tasks.filter((t) => !t.completed).slice(0, 5);
  const upcomingAssignments = assignments
    .filter((a) => !a.completed)
    .slice(0, 5);

  return (
    <View
      style={{ flex: 1, backgroundColor: "#f8fafc", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: "white",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CheckCircle size={32} color="#4f46e5" />
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#1f2937",
              marginLeft: 8,
            }}
          >
            TaskFlow
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View style={{ position: "relative" }}>
            <Bell size={24} color="#6b7280" />
            {notifications.length > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  backgroundColor: "#ef4444",
                  borderRadius: 8,
                  minWidth: 16,
                  height: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 10, fontWeight: "bold" }}
                >
                  {notifications.length}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity onPress={handleSignOut} style={{ padding: 8 }}>
            <LogOut size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4f46e5"]}
          />
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Welcome Section */}
        <View
          style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20 }}
        >
          <Text style={{ fontSize: 28, fontWeight: "bold", color: "#1f2937" }}>
            Welcome back, {user.name?.split(" ")[0]}!
          </Text>
          <Text style={{ fontSize: 16, color: "#6b7280", marginTop: 4 }}>
            {profile?.role === "teacher"
              ? "Manage your classes and assignments"
              : "Here's what you need to focus on today"}
          </Text>
        </View>

        {/* Stats Cards */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
            marginBottom: 24,
            gap: 12,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              padding: 16,
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 12, fontWeight: "500", color: "#6b7280" }}
                >
                  Tasks
                </Text>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginTop: 4,
                  }}
                >
                  {tasks.length}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#e0e7ff",
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <ListTodo size={20} color="#4f46e5" />
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              padding: 16,
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 12, fontWeight: "500", color: "#6b7280" }}
                >
                  Assignments
                </Text>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginTop: 4,
                  }}
                >
                  {assignments.length}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#f3e8ff",
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <BookOpen size={20} color="#8b5cf6" />
              </View>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: 16,
              }}
            >
              Recent Tasks
            </Text>

            {upcomingTasks.length === 0 ? (
              <Text
                style={{
                  textAlign: "center",
                  color: "#6b7280",
                  paddingVertical: 20,
                }}
              >
                No tasks yet. Create one to get started!
              </Text>
            ) : (
              <View style={{ gap: 12 }}>
                {upcomingTasks.slice(0, 3).map((task) => (
                  <View
                    key={task.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      padding: 12,
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      borderRadius: 8,
                      backgroundColor: "#f9fafb",
                      gap: 12,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        toggleTaskComplete(task.id, task.completed)
                      }
                      style={{ marginTop: 2 }}
                    >
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          borderWidth: 2,
                          borderColor: task.completed ? "#10b981" : "#d1d5db",
                          backgroundColor: task.completed
                            ? "#10b981"
                            : "transparent",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {task.completed && (
                          <CheckCircle size={14} color="white" />
                        )}
                      </View>
                    </TouchableOpacity>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: task.completed ? "#9ca3af" : "#1f2937",
                          textDecorationLine: task.completed
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {task.title}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 4,
                          gap: 8,
                        }}
                      >
                        <Calendar size={10} color="#6b7280" />
                        <Text
                          style={{
                            fontSize: 10,
                            color:
                              isOverdue(task.due_date) && !task.completed
                                ? "#ef4444"
                                : "#6b7280",
                          }}
                        >
                          {formatDate(task.due_date)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Quick Stats */}
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: 16,
              }}
            >
              Overview
            </Text>

            <View style={{ gap: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Users size={16} color="#8b5cf6" />
                  <Text style={{ fontSize: 14, color: "#6b7280" }}>
                    {profile?.role === "teacher" ? "My Classes" : "My Groups"}
                  </Text>
                </View>
                <Text
                  style={{ fontSize: 16, fontWeight: "600", color: "#1f2937" }}
                >
                  {groups.length}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <CheckCircle size={16} color="#10b981" />
                  <Text style={{ fontSize: 14, color: "#6b7280" }}>
                    Completed
                  </Text>
                </View>
                <Text
                  style={{ fontSize: 16, fontWeight: "600", color: "#1f2937" }}
                >
                  {tasks.filter((t) => t.completed).length +
                    assignments.filter((a) => a.completed).length}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Bell size={16} color="#f59e0b" />
                  <Text style={{ fontSize: 14, color: "#6b7280" }}>
                    Notifications
                  </Text>
                </View>
                <Text
                  style={{ fontSize: 16, fontWeight: "600", color: "#1f2937" }}
                >
                  {notifications.length}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
