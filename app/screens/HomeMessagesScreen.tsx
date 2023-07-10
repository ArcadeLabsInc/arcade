import React, { FC, useCallback, useContext, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, StyleSheet, RefreshControl } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { ScreenWithSidebar, ChannelItem, Text, RelayContext } from "app/components"
import { FlashList } from "@shopify/flash-list"
import { useStores } from "app/models"
import { BlindedEvent, ChannelManager, NostrPool, PrivateMessageManager } from "app/arclib/src"
import { DirectMessageItem } from "app/components/DirectMessageItem"
import { StatusBar } from "expo-status-bar"
import { spacing } from "app/theme"
import Animated, { FadeInDown } from "react-native-reanimated"

interface HomeMessagesScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"HomeMessages">> {}

const colors = {
  black: "black",
  bottomBarBackground: "rgba(0,24,24,0.65)",
  bottomBarBorder: "rgba(0,48,48,0.85)",
  logo: "#155e75",
  logoActive: "cyan",
}

export const HomeMessagesScreen: FC<HomeMessagesScreenProps> = observer(
  function HomeMessagesScreen() {
    const now = useRef(Math.floor(Date.now() / 1000))
    const pool = useContext(RelayContext) as NostrPool
    const channelManager = new ChannelManager(pool) as ChannelManager
    const pmgr = new PrivateMessageManager(pool) as PrivateMessageManager

    const [isRefresh, setIsRefresh] = useState(false)

    const {
      userStore: {
        pubkey,
        getChannels,
        getPrivMesages,
        addPrivMessage,
        fetchPrivMessages,
        updatePrivMessages,
      },
    } = useStores()

    const data = [...getChannels, ...getPrivMesages].sort(
      (a: { lastMessageAt: number }, b: { lastMessageAt: number }) =>
        b.lastMessageAt - a.lastMessageAt,
    )

    const refresh = async () => {
      setIsRefresh(true)
      const messages = await fetchPrivMessages(pool)
      if (messages) {
        updatePrivMessages(messages)
      }
      setIsRefresh(false)
    }

    useEffect(() => {
      function handleNewMessage(event: BlindedEvent) {
        console.log("new message", event)
        addPrivMessage(event)
      }

      async function subscribe() {
        return pmgr.sub(handleNewMessage, {
          kinds: [4],
          "#p": [pubkey],
          since: now.current,
        })
      }

      if (pool.ident) {
        // subscribe for new messages
        subscribe().catch(console.error)
      }

      return () => {
        pool.unsub(handleNewMessage)
      }
    }, [])

    const renderItem = useCallback(({ item, index }) => {
      return (
        <Animated.View entering={FadeInDown.delay(100 * index).duration(800)}>
          {item.kind === 4 ? (
            <DirectMessageItem dm={item} />
          ) : (
            <ChannelItem channel={item} channelManager={channelManager} />
          )}
        </Animated.View>
      )
    }, [])

    return (
      <ScreenWithSidebar title={"Home"}>
        <StatusBar style="light" />
        <FlashList
          data={data}
          keyExtractor={(item: { id: string }) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text text="No data..." />
            </View>
          }
          estimatedItemSize={50}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              colors={[colors.logo, colors.logoActive]}
              tintColor={colors.logoActive}
              refreshing={isRefresh}
              onRefresh={refresh}
            />
          }
        />
      </ScreenWithSidebar>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flex: 1,
  },
  emptyState: {
    alignSelf: "center",
    paddingVertical: spacing.medium,
  },
  list: {
    // flex: 1,
    // marginTop: 40,
    paddingHorizontal: 2,
    paddingVertical: 10,
  },
  logo: { color: colors.logo },
  logoActive: { color: colors.logoActive },
})
