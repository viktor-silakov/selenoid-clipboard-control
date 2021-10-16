// ==UserScript==
// @name        Selenoid Clipboard Control
// @version     3.9
// @author      Viktar Silakou
// @namespace   SCC
// @homepage    https://github.com/viktor-silakov/selenoid-clipboard-control
// @description Selenoid Clipboard Control User Script
// @match       */#/sessions/*
// @grant       GM.xmlHttpRequest
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.setClipboard

// ==/UserScript==

(function () {
        'use strict';
        // change the value if you use custom selenoid hub port
        const selenoidHubPort = '4444';

        function waitForElm(selector) {
            return new Promise(resolve => {
                    if (document.querySelector(selector)) {
                        return resolve(document.querySelector(selector));
                    }

                    const observer = new MutationObserver(mutations => {
                            if (document.querySelector(selector)) {
                                resolve(document.querySelector(selector));
                                observer.disconnect();
                            }
                        }
                    );

                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                }
            );
        }

        const request = (url, method = 'GET', data) => {
            return new Promise((resolve, reject) => {

                    GM.xmlHttpRequest({
                        method: method,
                        url,
                        data,
                        onload: function (response) {
                            return resolve(response.responseText);
                        }
                    });
                }
            )
        }

        console.log('Selenoid Clipboard Control user script starting...')

        const getClipBoard = (sessionId) => {
            console.log(`${location.protocol}//${document.domain}:${selenoidHubPort}/clipboard/${sessionId}`)
            return request(`${location.protocol}//${document.domain}:${selenoidHubPort}/clipboard/${sessionId}`);
        }

        const setClipBoard = (sessionId, data) => {
            console.log(`${location.protocol}//${document.domain}:${selenoidHubPort}/clipboard/${sessionId}`)
            return request(`${location.protocol}//${document.domain}:${selenoidHubPort}/clipboard/${sessionId}`, 'POST', data);
        }

        const addButton = (action, text, title = '') => {
            const toolbar = document.getElementsByClassName('vnc-card__controls')[0];

            const buttonInside = document.createElement('div');
            buttonInside.title = title;
            buttonInside.innerText = text;

            const button = document.createElement('a');
            button.classList.add('control');
            button.classList.add('clp-buttons');
            button.onclick = action;
            button.appendChild(buttonInside)
            // button.style.backgroundColor = '#ff4d4d';
            // button.style.color = '#white';

            toolbar.appendChild(button);
        }

        window.addEventListener('load', () => {
                const sessionId = document.URL.toString().replace(/(^.+?)sessions[\/]/, '');
                const style = document.createElement('style');
                style.innerText = ` 
                    .clp-buttons {
                        background-color: #ff4d4d !important;
                        color: #ff4d4d !important;
                        cursor: pointer;
                    }
                     .clp-buttons:hover {
                        background-color: #ff4d4d !important;
                        color: #ffffff !important;
                        cursor: pointer;
                    }`;
                document.body.appendChild(style);

                document.addEventListener('paste', async function (event) {
                    const clipText = event.clipboardData.getData('Text');
                    console.log({ clipText })
                    const resp = await setClipBoard(sessionId, clipText);
                    console.log({
                        resp
                    })
                });

                waitForElm('[title=Fullscreen]').then(async () => {

                        addButton(async () => {
                                const resp = await getClipBoard(sessionId);
                                console.log({
                                    'remote clipboard': resp,
                                })
                                GM.setClipboard(resp);
                            }
                            , 'G', 'get remote clipboard data');
                        addButton(async () => {
                                const text = prompt('please insert text')
                                const resp = await setClipBoard(sessionId, text);
                                console.log({
                                    resp
                                })
                            }
                            , 'S', 'set remote clipboard data')
                    }
                )
            }
        )
    }
)();
