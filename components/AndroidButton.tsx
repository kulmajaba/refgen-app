import React, { SFC } from 'react';
import { TouchableOpacity, Image, ImageStyle, ImageRequireSource, StyleSheet } from 'react-native'
import { colors } from '../util/styleConstants';

type Props = {
  imageSource: ImageRequireSource,
  onPress: () => void
};

const AndroidButton: SFC<Props> = (props: Props) => {
  return (
    <TouchableOpacity style={styles.androidButton} onPress={() => props.onPress()}>
      <Image
        source={props.imageSource}
        style={styles.androidButtonImage as ImageStyle}
      />
    </TouchableOpacity>
  )
}
export default AndroidButton;

const styles = StyleSheet.create({
  androidButton: {
    backgroundColor: colors.primaryColorD,
    padding: 14,
    borderRadius: 40,
    alignSelf: 'flex-end',
    marginBottom: 12,
    marginRight: 12
  },
  androidButtonImage: {
    width: 48,
    height: 48
  }
});