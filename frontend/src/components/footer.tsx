import React from 'react'
import github from '../github_logo.png'

interface Props {

}

export const Footer: React.FC<Props> = () => {
    return(
        <div id="footer">
            <p>Tehty Kerttulin Lukion ICT8 Kurssin Harjoitustyöksi</p>

            <div id='source'>
                <p>Lähdekoodi:</p>
                <a href='https://github.com/Akaseli/minesweeper'>
                    <img src={github} alt="Github logo"></img>
                </a>
            </div>
        </div>
    );
}