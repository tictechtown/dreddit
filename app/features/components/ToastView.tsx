import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import useTheme from '../../services/theme/useTheme';
import Icons from './Icons';
import Typography from './Typography';

type Props =
  | {
      show: boolean;
      label: string;
      onClose: () => void;
      actionName: string;
      onPress: () => void;
    }
  | {
      show: boolean;
      label: string;
      onClose: () => void;
    };

const ToastView = (props: Props) => {
  const theme = useTheme();

  useEffect(() => {
    if (props.show) {
      const timerId = setTimeout(() => {
        props.onClose();
      }, 3000);

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [props.show]);

  if (!props.show) {
    return;
  }

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
      }}>
      <View
        style={{
          marginHorizontal: 24,
          paddingLeft: 16,
          paddingRight: 12,
          height: 48,
          alignItems: 'center',
          flexDirection: 'row',
          borderRadius: 4,
          backgroundColor: theme.inverseSurface,
          columnGap: 12,
          elevation: 3,
          shadowColor: '#000',
        }}>
        <Typography variant="labelLarge" style={{ color: theme.inverseOnSurface, flex: 1 }}>
          {props.label}
        </Typography>
        {'onPress' in props && (
          <Pressable onPress={props.onPress}>
            <View>
              <Typography variant="labelLarge" style={{ color: theme.inversePrimary }}>
                {props.actionName}
              </Typography>
            </View>
          </Pressable>
        )}
        {!!props.onClose && (
          <Pressable onPress={props.onClose}>
            <Icons name="close" size={24} color={theme.inverseOnSurface} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default ToastView;
