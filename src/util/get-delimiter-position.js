"use strict";

const vscode = require('vscode')


const beginDisplayMath = [["$$", "\\[","\\("], ["$$", "\\[","\\(", "\\begin{equation}", "\\begin{eqaution*}","\\begin{align}", "\\begin{align*}", "\\begin{gather}" , "\\begin{gather*}" , "\\begin{displaymath}","\\begin{math}"]];
const endDisplayMath  =  [["$$", "\\]","\\)"], ["$$", "\\]","\\)", "\\end{equation}", "\\end{equation*}","\\end{align}", "\\end{align*}", "\\end{gather}" , "\\end{gather*}" , "\\end{displaymath}","\\end{math}"]];
const beginInlineMath = [["$", "\\("],["$", "\\(", "\\begin{math}"]];
const endInlineMath = [["$", "\\)"],["$", "\\)", "\\end{math}"]];

function getBegin(isLatex,isDisplay){
    const  newGetBegin = isDisplay ? beginDisplayMath : beginInlineMath;
    return newGetBegin[+isLatex]
}

function getEnd(isLatex, isDisplay){
    const  newGetEnd = isDisplay ? endDisplayMath : endInlineMath;
    return newGetEnd[+isLatex]
}

/**
 * @param {string} matchStr match string result
 * @param {number} matchStrIndex match index in string
 */
function MatchInfo(matchStr, matchStrIndex) {
    this.matchStr = matchStr;
    this.matchStrIndex = matchStrIndex;
}

/**
 * find first match substring
 * @param {string[]} strArr match array
 * @param {string} str string to match
 * @param {boolean} lastMatch 
 * @returns {MatchInfo | null}
 */
function searchSubStr(strArr, str, lastMatch) {
    for (let count = 0; count < strArr.length; count++) {
        let charIndex = lastMatch ? str.lastIndexOf(strArr[count]) : str.indexOf(strArr[count])
        if ( charIndex !== -1 ) 
            return new MatchInfo(strArr[count], charIndex)
    }
    return null;
}

/**
 * goto end delimiter
 * @param {vscode.TextDocument} document 
 * @param {vscode.Position} position 
 * @param {string[]} endMath 
 */
function jumpToEndPosition(document, position, endMath) {
    let insertPosition = position;
    let line = position.line;

    // current line
    let localRangeText = document.getText(new vscode.Range(position, document.lineAt(position).range.end));
    let match = searchSubStr(endMath, localRangeText);
    if (match) {							// y: jump
        insertPosition = new vscode.Position(line, position.character + match.matchStrIndex + match.matchStr.length)
    }
    else {													// n: loop
        while (++line < document.lineCount) {
            match = searchSubStr(endMath, document.lineAt(line).text);
            if (match) {
                insertPosition = new vscode.Position(line, match.matchStrIndex + match.matchStr.length);
                break
            }
        }
    }
    return {
        insertPosition,
        match
    };
}

/**
 * goto begin delimiter
 * @param {vscode.TextDocument} document 
 * @param {vscode.Position} position 
 * @param {string[]} beginMath 
 * @returns 
 */
function jumpToBeginPosition(document, position, beginMath) {
    let insertPosition = position;
    let line = position.line;

    // current line
    let localRangeText = document.getText(new vscode.Range(line, 0, line, position.character));
    let match = searchSubStr(beginMath, localRangeText, true);
    if (match) {							// y: jump
        insertPosition = new vscode.Position(line, match.matchStrIndex)
    }
    else {													// n: loop
        while (--line >= 0) {
            match = searchSubStr(beginMath, document.lineAt(line).text, true);
            if (match) {
                insertPosition = new vscode.Position(line, match.matchStrIndex);
                break
            }
        }
    }
    return {
        insertPosition,
        match
    };
}

module.exports = {
    MatchIndex: MatchInfo,
    searchSubStr,
    jumpToBeginPosition,
    jumpToEndPosition,
    getBegin,
    getEnd
}