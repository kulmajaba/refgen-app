import React, { SFC } from 'react';
import {
  Image,
  ImageRequireSource,
  ImageStyle,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import { colors } from '../util/styleConstants';

type ImageObject = {
  [key: string]: ImageRequireSource;
}

const images: ImageObject = {
  cameraWhite: require('../assets/camera-white.png') as ImageRequireSource,
  cameraDark: require('../assets/camera-dark.png') as ImageRequireSource,
  shareWhite: require('../assets/share-white.png') as ImageRequireSource,
  shareDark: require('../assets/share-dark.png') as ImageRequireSource
};

const androidPostFix = 'White';
const iosPostFix = 'Dark';

const androidImageSize = 40;
const iosImageSize = 36;

type Props = {
  textIos: string,
  image: 'camera' | 'share',
  onPress: () => void
};

const PlatformButton: SFC<Props> = (props: Props) => {
  if (Platform.OS === 'android') {
    return (
      <TouchableOpacity style={styles.androidButton} onPress={() => props.onPress()}>
        <Image
          source={images[props.image + androidPostFix]}
          style={styles.androidButtonImage as ImageStyle}
        />
      </TouchableOpacity>
    );
  }
  else {
    return (
      <TouchableOpacity style={styles.iosButton} onPress={() => props.onPress()}>
        <Text style={styles.iosButtonText}>{props.textIos}</Text>
        <Image
          source={images[props.image + iosPostFix]}
          style={styles.iosButtonImage as ImageStyle}
        />
      </TouchableOpacity>
    );
  }
}
export default PlatformButton;

const styles = StyleSheet.create({
  androidButton: {
    backgroundColor: colors.primaryColorD,
    elevation: 4,
    padding: 16,
    borderRadius: androidImageSize,
    alignSelf: 'flex-end',
    marginBottom: 12,
    marginRight: 12
  },
  androidButtonImage: {
    width: androidImageSize,
    height: androidImageSize
  },
  iosButton: {
    flexDirection: 'row',
    borderColor: colors.primaryColorD,
    borderWidth: 2,
    padding: 16,
    borderRadius: 24,
    alignSelf: 'center',
    alignItems: 'center',
  },
  iosButtonImage: {
    width: iosImageSize,
    height: iosImageSize
  },
  iosButtonText: {
    flex: 1,
    fontSize: 22,
    color: colors.primaryColorD,
    textAlign: 'center',
    marginLeft: iosImageSize
  }
});