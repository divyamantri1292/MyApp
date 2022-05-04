import React from 'react';
import {FlatList, View, Text, TouchableOpacity, StyleSheet} from 'react-native';

enum values {
  DOG = 'dog',
  CAT = 'cat',
}
enum states {
  CLOSED = 'closed',
  OPEN = 'open',
}

type GridElement = {
  state: states;
  value: values | string;
};

const App = () => {
  const [list, setList] = React.useState<Array<GridElement>>([]);
  const lastIndex = React.useRef<number>(-1);
  let disable = false;
  const [gameFinished, setGameFinished] = React.useState<boolean>(false);

  React.useEffect(() => {
    const indexes: Array<number> = [];
    while (indexes.length < 8) {
      let r = Math.floor(Math.random() * 15);
      if (indexes.indexOf(r) === -1) {
        indexes.push(r);
      }
    }
    const arr = Array.apply(null, Array(16)).map((_value, index) => ({
      state: states.CLOSED,
      value: indexes.includes(index) ? values.DOG : values.CAT,
    }));
    setList([...arr]);
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      const finished = list.filter(element => element.state === states.OPEN);
      if (finished.length === 16) {
        setGameFinished(true);
      }
    }, 3000);
  }, [list]);

  const onTap = React.useCallback(
    (index: number) => {
      console.log('index :', index);
      disable = true;
      const arr = [...list];
      console.log('list :', list);
      arr[index].state = states.OPEN;
      setList([...arr]);
      setTimeout(() => {
        disable = false;
        if (lastIndex.current === -1) {
          lastIndex.current = index;
        } else if (
          lastIndex.current !== -1 &&
          arr[lastIndex.current].value === arr[index].value
        ) {
          lastIndex.current = -1;
        } else if (arr[lastIndex.current].value !== arr[index].value) {
          arr[lastIndex.current].state = states.CLOSED;
          arr[index].state = states.CLOSED;
          lastIndex.current = -1;
        }
        setList([...arr]);
      }, 500);
    },
    [list],
  );

  const Grid = ({item, index}: {item: GridElement; index: number}) => {
    const customStyle =
      item.state === states.OPEN
        ? {backgroundColor: 'green'}
        : {backgroundColor: 'red'};
    return (
      <TouchableOpacity
        style={[styles.item, customStyle]}
        disabled={disable}
        testID={`${index}`}
        onPress={() => onTap(index)}>
        <Text>{item.state === states.CLOSED ? '' : item.value}</Text>
      </TouchableOpacity>
    );
  };

  const keyList = React.useCallback((item, index) => `${item}-${index}`, []);

  return (
    <View style={styles.container}>
      <FlatList
        numColumns={4}
        data={list}
        contentContainerStyle={styles.listContainer}
        keyExtractor={keyList}
        renderItem={Grid}
      />
      {gameFinished && (
        <Text style={styles.finishedText}>Game is Completed</Text>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  list: {
    flex: 1,
  },
  listContainer: {borderColor: 'black', borderWidth: 1},
  item: {
    height: 90,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  finishedText: {textAlign: 'center'},
});
