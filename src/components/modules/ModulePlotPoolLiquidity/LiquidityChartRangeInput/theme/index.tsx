import React from 'react';
import {Text, TextProps as TextPropsOriginal} from 'rebass';
import styled from 'styled-components';

type TextProps = Omit<TextPropsOriginal, 'css'>;

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
