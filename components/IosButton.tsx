import React, { SFC } from 'react';
import {
  Image,
  ImageRequireSource,
  ImageStyle,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

import { colors } from '../util/styleConstants';

type Props = {
  imageSource: ImageRequireSource,
  text: string,
  onPress: () => void
};

const IosButton: SFC<Props> = (props: Props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={() => props.onPress()}>
      <Text style={styles.buttonText}>{props.text}</Text>
      <Image
        source={props.imageSource}
        style={styles.buttonImage as ImageStyle}
      />
    </TouchableOpacity>
  )
}
export default IosButton;

const imageSize = 36

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    borderColor: colors.primaryColorD,
    borderWidth: 2,
    padding: 16,
    borderRadius: 24,
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonImage: {
    width: imageSize,
    height: imageSize
  },
  buttonText: {
    flex: 1,
    fontSize: 22,
    color: colors.primaryColorD,
    textAlign: 'center',
    marginLeft: imageSize
  }
});