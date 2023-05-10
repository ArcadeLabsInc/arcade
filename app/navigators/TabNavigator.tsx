import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { HomeMessagesScreen, BlankScreen } from "../screens"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"

export type DemoTabParamList = {
  Home: undefined
  Feed: undefined
  Create: undefined
  Discover: undefined
  Profile: undefined
  // DemoShowroom: { queryIndex?: string; itemIndex?: string }
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type DemoTabScreenProps<T extends keyof DemoTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DemoTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<DemoTabParamList>()

const inactiveIconColor = colors.palette.cyan950

export function TabNavigator() {
  const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeMessagesScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <Icon icon="Home" color={focused ? colors.tint : inactiveIconColor} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Feed"
        component={BlankScreen}
        options={{
          tabBarLabel: "Feed",
          tabBarIcon: ({ focused }) => (
            <Icon icon="Rss" color={focused ? colors.tint : inactiveIconColor} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="Create"
        component={BlankScreen}
        options={{
          tabBarLabel: "Create",
          tabBarIcon: ({ focused }) => (
            <Icon icon="PlusCircle" color={focused ? colors.tint : inactiveIconColor} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Discover"
        component={BlankScreen}
        options={{
          tabBarLabel: "Discover",
          tabBarIcon: ({ focused }) => (
            <Icon icon="Search" color={focused ? colors.tint : inactiveIconColor} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={BlankScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <Icon icon="User" color={focused ? colors.tint : inactiveIconColor} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.medium,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  flex: 1,
}
