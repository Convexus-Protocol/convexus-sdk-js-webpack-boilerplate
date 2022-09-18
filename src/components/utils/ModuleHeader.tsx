import React from 'react';
import {BsLink45Deg} from 'react-icons/bs';
import {AiFillGithub} from 'react-icons/ai';
import * as styles from './ModuleHeader.module.less';

export interface ModuleHeaderProps {
    name: string;
    text: string;
    link: string;
}

export function ModuleHeader({name, text, link}: ModuleHeaderProps) {
    return (
        <>
            <div className={styles.container}>
                <a href={'/#' + name}>
                    <BsLink45Deg size={40} />
                </a>
                <h1>
                    <pre className={styles.text}>{text}</pre>
                </h1>
                <a
                    href={
                        'https://github.com/Convexus-Protocol/convexus-sdk-js-webpack-boilerplate/blob/main/src/components/modules/' +
                        name +
                        '/' +
                        name +
                        '.tsx'
                    }
                >
                    <AiFillGithub size={40} />
                </a>
            </div>
        </>
    );
}
