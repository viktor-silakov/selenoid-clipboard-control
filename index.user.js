// ==UserScript==
// @name        Selenoid Clipboard Control
// @version     4.1.3
// @author      Viktar Silakou
// @namespace   SCC
// @homepage    https://github.com/viktor-silakov/selenoid-clipboard-control
// @description Selenoid Clipboard Control User Script
// @match       *
// @connect     *
// @run-at      document-body
// @grant       GM.xmlHttpRequest
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.setClipboard

// ==/UserScript==

(function () {
        'use strict';
        // change the value if you use custom selenoid hub port
        const BASE_URL = '';
        const SELENOID_HUB_PORT = '';

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
                if (!document.querySelector(".vnc-card__controls")) return;
                console.log('Selenoid Clipboard Control user script starting...')

                const sessionId = document.URL.toString().replace(/(^.+?)sessions[\/]/, '');

                const baseUrl = BASE_URL || `${location.protocol}//${document.domain}`
                const selenoidHubPort = SELENOID_HUB_PORT || '4444'
                const url = `${baseUrl}:${selenoidHubPort}/clipboard/${sessionId}`
                console.log({ url })
                const getClipBoard = () => {
                    return request(url);
                }

                const setClipBoard = (data) => {
                    return request(url, 'POST', data);
                }

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
                                const resp = await getClipBoard();
                                console.log({
                                    'remote clipboard': resp,
                                })
                                GM.setClipboard(resp);
                            }
                            , 'G', 'get remote clipboard data');
                        addButton(async () => {
                                const text = prompt('please insert text')
                                const resp = await setClipBoard(text);
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
