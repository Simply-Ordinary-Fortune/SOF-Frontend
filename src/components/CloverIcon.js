import React from 'react';
import {View} from 'react-native';
import Svg, {Defs, ClipPath, Path, Image} from 'react-native-svg';

const CloverIcon = ({imageUrl, size = 300}) => {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 32 32">
        <Defs>
          <ClipPath id="cloverClip">
            <Path d="M8.5 32C11.7469 32 14.5686 30.1795 16 27.5036C17.4314 30.1795 20.2531 32 23.5 32C28.1944 32 32 28.1944 32 23.5C32 20.2531 30.1795 17.4314 27.5036 16C30.1795 14.5686 32 11.7469 32 8.5C32 3.80557 28.1944 0 23.5 0C20.2531 0 17.4314 1.8205 16 4.49644C14.5686 1.8205 11.7469 0 8.5 0C3.80558 0 0 3.80557 0 8.5C0 11.7469 1.8205 14.5686 4.49645 16C1.8205 17.4314 0 20.2531 0 23.5C0 28.1944 3.80558 32 8.5 32Z" />
          </ClipPath>
        </Defs>
        <Image
          href={imageUrl}
          width="100%"
          height="100%"
          clipPath="url(#cloverClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      </Svg>
    </View>
  );
};

export default CloverIcon;
