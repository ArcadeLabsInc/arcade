import {
  Canvas,
  makeImageFromView,
  Image,
  useValue,
  useComputedValue,
  rect,
  Blur,
  SkImage,
  runTiming,
  useValueEffect,
} from "@shopify/react-native-skia"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { View, StyleSheet, TouchableOpacity, ViewProps, ViewStyle } from "react-native"

import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  MeasuredDimensions,
  useAnimatedProps,
} from "react-native-reanimated"
import { Text } from "../Text"
import { BlurredPopupContext, PopupAlignment, PopupOptionType } from "./BlurredContext"

type BlurredPopupProviderProps = {
  children?: React.ReactNode
}

const BlurredPopupProvider: React.FC<BlurredPopupProviderProps> = ({ children }) => {
  const [params, setParams] = useState<{
    image: SkImage
    node: React.ReactNode
    layout: MeasuredDimensions
    options?: PopupOptionType[]
  } | null>(null)

  const image = useMemo(() => {
    if (!params) return null
    return params.image
  }, [params])

  const options = useMemo(() => {
    if (!params) return []
    return params.options
  }, [params])

  const mainView = useRef(null)

  const showPopup = useCallback(
    async ({
      node,
      layout,
      options,
    }: {
      node: React.ReactNode
      layout: MeasuredDimensions
      options: PopupOptionType[]
    }) => {
      const skImage = await makeImageFromView(mainView)
      setParams({ image: skImage, node, layout, options })
    },
    [],
  )

  const canvasSize = useValue({ width: 0, height: 0 })

  const sBlurValue = useValue(0)

  const close = useCallback(() => {
    runTiming(sBlurValue, 0, {
      duration: 200,
    })
  }, [])

  useEffect(() => {
    if (image) {
      runTiming(sBlurValue, 10, {
        duration: 200,
      })
    }
  }, [image])

  useValueEffect(sBlurValue, (value) => {
    if (value === 0) {
      setParams(null)
    }
  })

  const imageRect = useComputedValue(() => {
    return rect(0, 0, canvasSize.current.width, canvasSize.current.height)
  }, [canvasSize])

  const nodeStyle = useMemo(() => {
    if (!params) return {} as any
    return {
      position: "absolute",
      top: params.layout.pageY,
      left: params.layout.pageX,
      width: params.layout.width,
      height: params.layout.height,
      zIndex: -10,
    }
  }, [params])

  const popupItems = options.length
  const popupItemsHeight = 50
  const popupHeight = popupItemsHeight * popupItems

  const popupStyle = useMemo(() => {
    if (!params) return {} as ViewStyle
    const { pageX, pageY, width, height } = params.layout

    const yAlignment = canvasSize.current.height - pageY - popupHeight < 100 ? "top" : "bottom"
    const xAlignment = canvasSize.current.width - pageX > 200 ? "left" : "left"
    const alignment: PopupAlignment = `${yAlignment}-${xAlignment}` as PopupAlignment

    const x = alignment.includes("right") ? pageX + width : pageX
    const y = alignment.includes("bottom") ? pageY + height : pageY - popupHeight

    return {
      position: "absolute",
      top: y,
      left: x,
      height: popupHeight,
    } as ViewStyle
  }, [params, popupHeight])

  const hasParams = params != null
  const pointerEventsProps = useAnimatedProps(() => {
    return {
      pointerEvents: hasParams ? "auto" : "none",
    } as Partial<ViewProps>
  }, [hasParams])

  const canvasStyle = useMemo(() => {
    return {
      ...StyleSheet.absoluteFillObject,
      zIndex: image ? 100 : -10,
      backgroundColor: "transparent",
    }
  }, [image])

  return (
    <>
      <BlurredPopupContext.Provider value={{ showPopup }}>
        <Animated.View animatedProps={pointerEventsProps} style={styles.mainPopupContainerView}>
          {params?.image != null && popupItems != null && (
            <Animated.View
              layout={Layout}
              entering={FadeIn.delay(100)}
              exiting={FadeOut}
              style={[popupStyle, styles.popup]}
            >
              {options.map(({ leading, trailing, label, onPress }, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      close()
                      onPress()
                    }}
                    activeOpacity={0.9}
                    key={index}
                    style={{
                      height: popupItemsHeight,
                      backgroundColor: "rgba(255,255,255,0.75)",
                      alignItems: "center",
                      paddingHorizontal: 10,
                      flexDirection: "row",
                    }}
                  >
                    {leading}
                    <Text style={{ color: "black", marginRight: 10, marginLeft: 5 }}>{label}</Text>
                    {trailing}
                  </TouchableOpacity>
                )
              })}
            </Animated.View>
          )}
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              zIndex: -5,
            }}
            onTouchEnd={close}
          />
          <Animated.View style={nodeStyle}>{params?.node}</Animated.View>
        </Animated.View>
        <Canvas
          onSize={canvasSize}
          style={canvasStyle}
          onTouchEnd={() => {
            close()
          }}
        >
          {image && (
            <Image rect={imageRect} image={image}>
              <Blur blur={sBlurValue} />
            </Image>
          )}
        </Canvas>
        <View ref={mainView} style={styles.container}>
          {children}
        </View>
      </BlurredPopupContext.Provider>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainPopupContainerView: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 500,
  },
  popup: {
    borderRadius: 5,
    overflow: "hidden",
  },
})

export { BlurredPopupProvider }
