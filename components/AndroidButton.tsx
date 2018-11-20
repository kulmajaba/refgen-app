import React, { SFC } from 'react';
import {
  Image,
  ImageRequireSource,
  ImageStyle,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { colors } from '../util/styleConstants';

type Props = {
  imageSource: ImageRequireSource,
  onPress: () => void
};

const AndroidButton: SFC<Props> = (props: Props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={() => props.onPress()}>
      <Image
        source={props.imageSource}
        style={styles.buttonImage as ImageStyle}
      />
    </TouchableOpacity>
  )
}
export default AndroidButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primaryColorD,
    elevation: 4,
    padding: 16,
    borderRadius: 40,
    alignSelf: 'flex-end',
    marginBottom: 12,
    marginRight: 12
  },
  buttonImage: {
    width: 40,
    height: 40
  }
});