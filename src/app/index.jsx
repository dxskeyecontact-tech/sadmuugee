import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CheckCircle,
  Users,
  Calendar,
  Bell,
  ArrowRight,
} from "lucide-react-native";
import { useAuth } from "@/utils/auth/useAuth";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const insets = useSafeAreaInsets();
  const { signIn, isAuthenticated, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isReady, isAuthenticated, router]);

  const handleSignIn = () => {
    signIn();
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "#f8fafc", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 20,
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

          <TouchableOpacity
            onPress={handleSignIn}
            style={{
              backgroundColor: "#4f46e5",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 40 }}>
          <View style={{ alignItems: "center", marginBottom: 40 }}>
            <Text
              style={{
                fontSize: 36,
                fontWeight: "bold",
                textAlign: "center",
                color: "#1f2937",
                marginBottom: 16,
              }}
            >
              Manage Tasks &{"\n"}
              <Text style={{ color: "#4f46e5" }}>Assignments</Text>
            </Text>

            <Text
              style={{
                fontSize: 18,
                textAlign: "center",
                color: "#6b7280",
                lineHeight: 26,
                marginBottom: 32,
              }}
            >
              Perfect for students and teachers. Stay organized and meet
              deadlines.
            </Text>

            <TouchableOpacity
              onPress={handleSignIn}
              style={{
                backgroundColor: "#4f46e5",
                paddingHorizontal: 32,
                paddingVertical: 16,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#4f46e5",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "600",
                  marginRight: 8,
                }}
              >
                Get Started
              </Text>
              <ArrowRight size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Features */}
          <View style={{ gap: 20 }}>
            <View
              style={{
                backgroundColor: "white",
                padding: 24,
                borderRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: "#e0e7ff",
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <CheckCircle size={24} color="#4f46e5" />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: 8,
                }}
              >
                Personal Tasks
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  lineHeight: 20,
                }}
              >
                Create and manage your own to-do lists with priorities and
                deadlines
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "white",
                padding: 24,
                borderRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: "#f3e8ff",
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Users size={24} color="#8b5cf6" />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: 8,
                }}
              >
                Group Management
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  lineHeight: 20,
                }}
              >
                Teachers can create classes and assign work to groups of
                students
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
