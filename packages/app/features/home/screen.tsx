import { Screen } from 'app/views'
import { useLink } from 'solito/link'
import { Button, Image, Stack, useTheme, YStack } from 'tamagui'
import { palette } from '@my/ui'
import { Key, UserPlus } from '@tamagui/lucide-icons'
import { logo } from './logo'

export function HomeScreen() {
  const createLinkProps = useLink({ href: '/create' })
  const loginLinkProps = useLink({ href: '/login' })
  const theme = useTheme()
  console.log(theme.background)
  //   console.log('theme:', theme.background.val)
  return (
    <Screen>
      <YStack f={1} alignItems="center" justifyContent="space-evenly">
        <Stack />
        <Image src={logo} width={200} height={200} mt={-60} />
        <YStack space="$6">
          <Button
            {...createLinkProps}
            als="center"
            icon={UserPlus}
            size="$5"
            // theme="blue"
            // bc="$electricIndigo"
            focusStyle={{ opacity: 0.9, borderWidth: 0 }}
            // hoverStyle={{ backgroundColor: '$electricIndigo', borderWidth: 0 }}
            shadowColor={palette.portGore}
            // shadowOffset={{ width: 1.5, height: 1.5 }}
            shadowRadius={8}
            shadowOpacity={0.3}
          >
            Create Account
          </Button>
          <Button
            {...loginLinkProps}
            als="center"
            icon={Key}
            size="$5"
            // theme="purple_darker"
            shadowColor={palette.portGore}
            focusStyle={{ opacity: 0.9, borderWidth: 0 }}
            // shadowOffset={{ width: 1.5, height: 1.5 }}
            shadowRadius={8}
            shadowOpacity={0.1}
            theme="darker"
          >
            Login
          </Button>
        </YStack>
      </YStack>
    </Screen>
  )
}
