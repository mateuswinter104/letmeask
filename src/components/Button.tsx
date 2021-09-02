import { ButtonHTMLAttributes } from 'react'

import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
}

//{isOutlined, ...props} -> rest operator
//pegar a propriedade isOutlined, se não for, pegar a propriedade de props

export function Button({isOutlined = false, ...props}: ButtonProps) {
    return (
        <button className={`button ${isOutlined ? 'outlined' : ''}`}
            {...props} />
    )
}