import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Polyline } from "react-native-svg";
import codePush from "react-native-code-push";

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START };

function App() {
  useEffect(() => {
    codePush.sync({
      installMode: codePush.InstallMode.IMMEDIATE,
      cb: (status) => console.log(status, "Status"),
    });
  }, []);

  const checkFirstNode = (x, y) => {
    if (locationList.length > 0) {
      const { 0: loc } = locationList;
      console.log(loc, x, y, "loc");
      if (
        locationList.length > 2 &&
        loc.x === locationList[locationList.length - 1].x &&
        loc.y === locationList[locationList.length - 1].y
      ) {
        return true;
      }
      if (
        (x > loc.x && x < loc.x + 25 && y > loc.y && y < loc.y + 25) ||
        (x < loc.x && x > loc.x - 25 && y < loc.y && y > loc.y - 25)
      ) {
        setLocationList([...locationList, loc]);
        console.log(loc, "LOC1");
      } else {
        setLocationList(locationList.concat({ x, y }));
      }
    } else {
      setLocationList(locationList.concat({ x, y }));
    }
  };
  const [locationList, setLocationList] = useState([]);

  const panresponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,

    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,

    onMoveShouldSetPanResponder: (evt, gestureState) => false,

    onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

    onPanResponderGrant: (evt, gestureState) => false,

    onPanResponderMove: (evt, gestureState) => false,

    onPanResponderRelease: (evt, gestureState) => {
      checkFirstNode(
        evt.nativeEvent.pageX.toFixed(2) - 0,
        evt.nativeEvent.pageY.toFixed(2) - 84
      );
      // setLocationList(
      //   locationList.concat({
      //     x: evt.nativeEvent.pageX.toFixed(2) - 0,
      //     y: evt.nativeEvent.pageY.toFixed(2) - 84,
      //   })
      // );
    },
  });

  const h2 = Platform.OS === "ios" ? 90 : 70;

  const GesturePath = ({ path, color }) => {
    const { width, height } = Dimensions.get("window");
    const points = path?.map((p) => `${p.x},${p.y}`).join(" ");
    return (
      <Svg
        style={{ backgroundColor: "transparent" }}
        viewBox={`0 0 ${width} ${height - h2}`}
      >
        <Polyline points={points} fill="none" stroke={color} strokeWidth="3" />
      </Svg>
    );
  };

  console.log(locationList, "Location");
  return (
    <View style={styles.container}>
      <StatusBar translucent />
      <TouchableOpacity
        style={{ padding: 5 }}
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
                top: parseFloat(l.y - 0),
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

export default codePush(codePushOptions)(App);

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
    backgroundColor: "red",
  },
});
