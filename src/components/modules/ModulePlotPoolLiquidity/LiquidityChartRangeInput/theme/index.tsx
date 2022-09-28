import React from 'react';
import {Text, TextProps as TextPropsOriginal} from 'rebass';
import styled from 'styled-components';
import {Colors} from './styled';
import {colors as ColorsPalette, colorsDark, colorsLight} from './colors';

type TextProps = Omit<TextPropsOriginal, 'css'>;

const deprecated_white = ColorsPalette.white;
const deprecated_black = ColorsPalette.black;

const opacities = {
    hover: 0.6,
    click: 0.4,
};

export function getTheme(darkMode: boolean): any {
    return {
        grids: {
            sm: 8,
            md: 12,
            lg: 24,
        },

        //shadows
        shadow1: darkMode ? '#000' : '#2F80ED',

        opacity: opacities,

        darkMode,
        // base
        deprecated_white,
        deprecated_black,

        // text
        deprecated_text1: darkMode ? '#FFFFFF' : '#000000',
        deprecated_text2: darkMode ? '#C3C5CB' : '#565A69',
        deprecated_text3: darkMode ? '#8F96AC' : '#6E727D',
        deprecated_text4: darkMode ? '#B2B9D2' : '#C3C5CB',
        deprecated_text5: darkMode ? '#2C2F36' : '#EDEEF2',

        // backgrounds / greys
        deprecated_bg0: darkMode ? '#191B1F' : '#FFF',
        deprecated_bg1: darkMode ? '#212429' : '#F7F8FA',
        deprecated_bg2: darkMode ? '#2C2F36' : '#EDEEF2',
        deprecated_bg3: darkMode ? '#40444F' : '#CED0D9',
        deprecated_bg4: darkMode ? '#565A69' : '#888D9B',
        deprecated_bg5: darkMode ? '#6C7284' : '#888D9B',
        deprecated_bg6: darkMode ? '#1A2028' : '#6C7284',

        //specialty colors
        deprecated_modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
        deprecated_advancedBG: darkMode
            ? 'rgba(0,0,0,0.1)'
            : 'rgba(255,255,255,0.6)',

        //primary colors
        deprecated_primary1: darkMode ? '#2172E5' : '#E8006F',
        deprecated_primary2: darkMode ? '#3680E7' : '#FF8CC3',
        deprecated_primary3: darkMode ? '#4D8FEA' : '#FF99C9',
        deprecated_primary4: darkMode ? '#376bad70' : '#F6DDE8',
        deprecated_primary5: darkMode ? '#153d6f70' : '#FDEAF1',

        // color text
        deprecated_primaryText1: darkMode ? '#5090ea' : '#D50066',

        // secondary colors
        deprecated_secondary1: darkMode ? '#2172E5' : '#E8006F',
        deprecated_secondary2: darkMode ? '#17000b26' : '#F6DDE8',
        deprecated_secondary3: darkMode ? '#17000b26' : '#FDEAF1',

        // other
        deprecated_red1: darkMode ? '#FF4343' : '#DA2D2B',
        deprecated_red2: darkMode ? '#F82D3A' : '#DF1F38',
        deprecated_red3: '#D60000',
        deprecated_green1: darkMode ? '#27AE60' : '#007D35',
        deprecated_yellow1: '#E3A507',
        deprecated_yellow2: '#FF8F00',
        deprecated_yellow3: '#F3B71E',
        deprecated_blue1: darkMode ? '#2172E5' : '#0068FC',
        deprecated_blue2: darkMode ? '#5199FF' : '#0068FC',
        deprecated_error: darkMode ? '#FD4040' : '#DF1F38',
        deprecated_success: darkMode ? '#27AE60' : '#007D35',
        deprecated_warning: '#FF8F00',

        // dont wanna forget these blue yet
        deprecated_blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    };
}

export const MEDIA_WIDTHS = {
    deprecated_upToExtraSmall: 500,
    deprecated_upToSmall: 720,
    deprecated_upToMedium: 960,
    deprecated_upToLarge: 1280,
};

const TextWrapper = styled(Text)<{color: keyof any}>`
    color: ${({color, theme}) => (theme as any)[color]};
`;

/**
 * Preset styles of the Rebass Text component
 */
export const ThemedText = {
    DeprecatedMain(props: TextProps) {
        return (
            <TextWrapper
                fontWeight={500}
                color={'deprecated_text2'}
                {...props}
            />
        );
    },
    DeprecatedLink(props: TextProps) {
        return (
            <TextWrapper
                fontWeight={500}
                color={'deprecated_primary1'}
                {...props}
            />
        );
    },
    Link(props: TextProps) {
        return (
            <TextWrapper
                fontWeight={600}
                fontSize={14}
                color={'accentAction'}
                {...props}
            />
        );
    },
    DeprecatedLabel(props: TextProps) {
        return (
            <TextWrapper
                fontWeight={600}
                color={'deprecated_text1'}
                {...props}
            />
        );
    },
    DeprecatedBlack(props: TextProps) {
        return (
            <TextWrapper
                fontWeight={500}
                color={'deprecated_text1'}
                {...props}
            />
        );
    },
    DeprecatedWhite(props: TextProps) {
        return (
            <TextWrapper
                fontWeight={500}
                color={'deprecated_white'}
                {...props}
            />
        );
    },
    DeprecatedBody(props: TextProps) {
        return (
            <TextWrapper
                fontWeight={400}
                fontSize={16}
                color={'deprecated_text1'}
                {...props}
            />
        );
    },
    BodySecondary(props: TextProps) {
        return (
            <TextWrapper
                fontWeight={400}
                fontSize={16}
                color={'textSecondary'}
                {...props}
            />
        );
    },
    BodyPrimary(props: TextProps) {
        return (
            <TextWrapper
                fontWeight={400}
                fontSize={16}
                color={'textPrimary'}
                {...props}
            />
        );
    },
    DeprecatedLargeHeader(props: TextProps) {
        return <TextWrapper fontWeight={600} fontSize={24} {...props} />;
    },
    LargeHeader(props: TextProps) {
        return (
            <TextWrapper
                fontWeight={400}
                fontSize={36}
                color={'textPrimary'}
                {...props}
            />
        );
    },
    DeprecatedMediumHeader(props: TextProps) {
        return <TextWrapper fontWeight={500} fontSize={20} {...props} />;
    },
    MediumHeader(props: TextProps) {
        return (
            <TextWrapper
                fontWeight={400}
                fontSize={20}
                color={'textPrimary'}
                {...props}
            />
        );
    },
    DeprecatedSubHeader(props: TextProps) {
        return <TextWrapper fontWeight={400} fontSize={14} {...props} />;
    },
    SubHeader(props: TextProps) {
        return (
            <TextWrapper
                fontWeight={600}
                fontSize={16}
                color={'textPrimary'}
                {...props}
            />
        );
    },
    DeprecatedSmall(props: TextProps) {
        return <TextWrapper fontWeight={500} fontSize={11} {...props} />;
    },
    DeprecatedBlue(props: TextProps) {
        return (
            <TextWrapper
                fontWeight={500}
                color={'deprecated_blue1'}
                {...props}
            />
        );
    },
    DeprecatedYellow(props: TextProps) {
        return (
            <TextWrapper
                fontWeight={500}
                color={'deprecated_yellow3'}
                {...props}
            />
        );
    },
    DeprecatedDarkGray(props: TextProps) {
        return (
            <TextWrapper
                fontWeight={500}
                color={'deprecated_text3'}
                {...props}
            />
        );
    },
    DeprecatedGray(props: TextProps) {
        return (
            <TextWrapper fontWeight={500} color={'deprecated_bg3'} {...props} />
        );
    },
    DeprecatedItalic(props: TextProps) {
        return (
            <TextWrapper
                fontWeight={500}
                fontSize={12}
                fontStyle={'italic'}
                color={'deprecated_text2'}
                {...props}
            />
        );
    },
    DeprecatedError({error, ...props}: {error: boolean} & TextProps) {
        return (
            <TextWrapper
                fontWeight={500}
                color={error ? 'deprecated_red1' : 'deprecated_text2'}
                {...props}
            />
        );
    },
};
