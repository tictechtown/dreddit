import { MaterialIcons } from '@expo/vector-icons';

type Props = React.ComponentProps<typeof MaterialIcons>;

export type IconName = React.ComponentProps<typeof MaterialIcons>['name'];
// Visit: https://icons.expo.fyi/Index
export default (props: Props) => {
  return <MaterialIcons {...props} />;
};
