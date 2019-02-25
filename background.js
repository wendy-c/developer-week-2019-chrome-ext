// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const whiteList = [
  {label: 'Baby Shark Dance | Sing and Dance! | Animal Songs | PINKFONG Songs for Children', url: 'https://www.youtube.com/watch?v=XqZsoesa55w'},
  {label: 'Sesame Street: If You\'re Happy and You Know It | Elmo\'s Sing-Along', url: 'https://www.youtube.com/watch?v=5015skRvqs8'},
  {label: 'If You’re Happy and You Know It + More Baby Songs by Dave and Ava', url: 'https://www.youtube.com/watch?v=WbUP2PO9gFI'}
]

chrome.runtime.onInstalled.addListener(function() {
  
  chrome.storage.sync.set({ whiteList }, function() {
    console.log("storing white list")
  })
  chrome.tabs.query({active: true, currentWindow: true}, tab => {
    
    const allowLocalHost = tab[0].url.indexOf("localhost") > -1;
    const allowGitHub = tab[0].url.indexOf("github") > -1;
    const allowDocusign = tab[0].url.indexOf("docusign") > -1;
    // permission value should be coming from server when db is set up
    const isAdminUser = false;
    if (!tab[0] || allowLocalHost || allowGitHub || allowDocusign || isAdminUser) {
      return;
    } 

    // check if url is on whitelist, tab.url
    if (tab[0].url.indexOf("chrome://") === -1) {
      
      const isOnList = whiteList.reduce((acc, item) => {
        return acc || item.url === tab[0].url;
      }, false);

      if (!isOnList) {
        chrome.tabs.executeScript({
          code: "document.body.innerText='YOU DO NOT HAVE PERMISSION'",
        }, function() {
          if(chrome.runtime.lastError) {
            console.error("Script injection failed: " + chrome.runtime.lastError.message);
          }
        })
      }
    }

  })
})


chrome.tabs.onUpdated.addListener(function() {
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
    const allowLocalHost = tab[0].url.indexOf("localhost") > -1;
    const allowGitHub = tab[0].url.indexOf("github") > -1;
    const allowDocusign = tab[0].url.indexOf("docusign") > -1;
    // permission value should be coming from server when db is set up
    const isAdminUser = false;
    if (!tab[0] || allowLocalHost || allowGitHub || allowDocusign || isAdminUser) {
      return;
    } 
    
    if (tab[0].url.indexOf("chrome://") === -1) {
      
        // check if URL is on white list
        const isOnList = whiteList.reduce((acc, item) => {
            return acc || item.url === tab[0].url;
          }, false);

        if (!isOnList) {
          
          chrome.tabs.executeScript({
            code: "document.body.innerText='YOU DO NOT HAVE PERMISSION'",
          }, function() {
            if(chrome.runtime.lastError) {
              console.error("Script injection failed: " + chrome.runtime.lastError.message);
            }
          })
        }

    }
  })
})

chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [new chrome.declarativeContent.PageStateMatcher({
      pageUrl: {hostEquals: 'developer.chrome.com'},
    })
    ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
  }]);
});