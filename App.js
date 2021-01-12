import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Polyline } from "react-native-svg";

export default function App() {
  const [location, setLocation] = useState({ y: 0, x: 0 });

  const [locationList, setLocationList] = useState([]);

  const panresponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,

    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,

    onMoveShouldSetPanResponder: (evt, gestureState) => false,

    onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

    onPanResponderGrant: (evt, gestureState) => false,

    onPanResponderMove: (evt, gestureState) => false,

    onPanResponderRelease: (evt, gestureState) => {
      setLocationList(
        locationList.concat({
          x: evt.nativeEvent.locationX.toFixed(2),
          y: evt.nativeEvent.locationY.toFixed(2),
        })
      );
    },
  });

  const GesturePath = ({ path, color }) => {
    const { width, height } = Dimensions.get("window");
    const points = path?.map((p) => `${p.x},${p.y}`).join(" ");
    return (
      <Svg
        height="100%"
        width="100%"
        style={{ backgroundColor: "transparent" }}
        viewBox={`0 0 ${width} ${height - 90}`}
      >
        <Polyline
          points={points}
          strokeColors={[
            "#7F0000",
            "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
            "#B24112",
            "#E5845C",
            "#238C23",
            "#7F0000",
          ]}
          fill="none"
          stroke={color}
          strokeWidth="3"
        />
      </Svg>
    );
  };

  console.log(locationList, "Location");
  return (
    <View style={styles.container}>
      <StatusBar translucent />
      <TouchableOpacity
        onPress={() => {
          const array = locationList;
          array.pop();
          setLocationList([...array]);
        }}
      >
        <Text
          style={{
            fontWeight: "700",
            marginTop: 40,
            fontSize: 20,
            textAlign: "right",
            marginRight: 10,
            color: "black",
          }}
        >
          UNDO
        </Text>
      </TouchableOpacity>
      <View {...panresponder.panHandlers} style={styles.innerView}>
        <GesturePath path={locationList} color="gray" />

        {locationList.map((l, i) => (
          <View
            key={i + l.y}
            style={[
              styles.dot,
              {
                top: parseFloat(l.y - 15),
                left: parseFloat(l.x - 15),
              },
            ]}
          />
        ))}
        <View
          style={{ flex: 1, backgroundColor: "transparent" }}
          {...panresponder.panHandlers}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 20 : 0,
  },

  innerView: {
    flex: 1,
    // backgroundColor: "rgba(0,0,0,0.9)",
    overflow: "hidden",
  },

  label: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    textAlign: "center",
  },

  dot: {
    position: "absolute",
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "black",
  },
});
