import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Alert,
} from "react-native";

export default function App() {
  const [data, setData] = useState([]);

  const getDataUsingGet = async (id) => {
    try {
      const response = await fetch(
        `http://13.233.95.158:5000/api_get_my_events/${id ? id : -1}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDg5NzM1NjQyYjQwZjcwYjU4YjQ0MWYiLCJpYXQiOjE2OTE3NDA1NzYsImV4cCI6MTY5MzkwMDU3Nn0._Rrl8lEJgaBE29qvOZubRRqu3_VY7tHnGQjFYqX2fJg`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setData((preV) => {
        return [...preV, ...data.data];
      });
      if (data.data.length === 0) alert("No data found");
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDataUsingGet();
  }, []);

  const renderItem = ({ item }) => (
    <Pressable style={styles.item}>
      <Text style={[styles.title].join(" ")}>
        {item.event_name} {item.event_type === "Online" ? "Online" : "offine"}
      </Text>
    </Pressable>
  );

  const handleLoadMore = () => {
    getDataUsingGet(data[data.length - 1]._id); // Load the next page of data
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  item: {
    padding: 32,
    marginBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 16,
  },
});
