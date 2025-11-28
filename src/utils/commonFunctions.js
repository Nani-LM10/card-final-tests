const convertHexToRbgaObj = (hexColor) => {
    // Convert hex to { r, g, b, a }
    let hex = hexColor.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(x => x + x).join('');
    }
    const num = parseInt(hex, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
        a: 1
    };
}

const convertRgbaObjToHex = ({ r, g, b }) => {
    const toHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return (
        '#' +
        toHex(r) +
        toHex(g) +
        toHex(b)
    );
};

const charMap = {
    'Ǎ': 'A',
    'Æ': 'A',
    'Ã': 'A',
    'Å': 'A',
    'Ą': 'A',
    'Ś': 'S',
    'Ş': 'S',
    'Š': 'S',
    'ẞ': 'S',
    'Ď': 'D',
    'Ð': 'D',
    'Ž': 'Z',
    'Ç': 'C',
    'Ć': 'C',
    'Č': 'C',
    'Ň': 'N',
    'Ń': 'N',
    'Ñ': 'N'
};

const normalizeCharacters = (input) => {
    const str = String(input);
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .split('')
        .map(char => charMap[char] || char)
        .join('');
}

function normalizeA(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[ǍÆÃÅĄ]/gi, 'A');
}

export {
    convertHexToRbgaObj,
    convertRgbaObjToHex,
    normalizeA,
    normalizeCharacters
}