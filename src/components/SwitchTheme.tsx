import { Switch } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

interface SwitchThemeProps {
   darkMode: boolean;
   setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SwitchTheme = ({ darkMode, setDarkMode }: SwitchThemeProps) => {
   return (
      <div className="flex justify-end p-2">
         <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
         />
      </div>
   );
};
