import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    title: "light" | "dark";

    colors: {
      primary: string;
      textPrimary: string;
      secondary: string;
      textSecondary: string;
      background: string;
      textBackground: string;
      error: string;
      textError: string;
      warning: string;
      textWarning: string;
      info: string;
      textInfo: string;
      success: string;
      textSuccess: string;
      color1: string;
      color2: string;
      color3: string;
      color4: string;
      color5: string;
      color6: string;
    };

    metrics: {
      padding: string;
      margin: string;
      gap: string;
      radius: string;
      inner_radius: string;
      header_height: string;
      menu_width: string;
      mobile_small: string;
      mobile_medium: string;
      mobile_large: string;
      tablet_small: string;
      tablet_medium: string;
      tablet_large: string;
      desktop_small: string;
      desktop_medium: string;
      desktop_large: string;
      desktop_xlarge: string;
    };
  }

  export interface PolymorphicComponentProps<
    T extends React.ElementType,
    P = {}
  > {
    as?: T;
    theme: DefaultTheme;
  }
}

