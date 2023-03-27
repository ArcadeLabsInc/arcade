import { NavHeader } from '@my/ui/src'
import { Stack } from 'expo-router'

export const unstable_settings = {
  initialRouteName: 'channels',
}

export default () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="channels"
      options={{
        headerShown: true,
        title: 'Channels',
        animation: 'slide_from_right',
        header: ({ options }) => (
          <NavHeader
            options={options}
            title={options.title}
            // rightButton={<CreateChannelButton />}
          />
        ),
      }}
    />
    <Stack.Screen
      name="channel"
      options={{
        headerShown: true,
        title: 'Channel',
        animation: 'slide_from_right',
        header: ({ options }) => (
          <NavHeader
            options={options}
            title={options.title}
            // rightButton={<CreateChannelButton />}
          />
        ),
      }}
    />
  </Stack>
)
