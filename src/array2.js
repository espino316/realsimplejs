function getUniqueValues(arr) {
    const hashTable = {};
    const uniqueValues = [];

    for (let i = 0; i < arr.length; i++) {
        const currentValue = arr[i];
        if (!hashTable[currentValue]) {
            hashTable[currentValue] = true;
            uniqueValues.push(currentValue);
        }
    }

    return uniqueValues;
}

function where(arr, property, value) {
    return arr.filter(obj => obj[property] == value);
}

function first(arr) {
    return arr.length > 0 ? arr[0] : undefined;
}

function last(arr) {
    return arr.length > 0 ? arr[arr.length - 1] : undefined;
}

function like(arr, property, value) {
    return arr.filter(obj => String(obj[property]).includes(value));
}

function sortAsc(arr, property) {
    return arr.slice().sort((a, b) => {
        const aValue = a[property];
        const bValue = b[property];
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return aValue - bValue;
        } else {
            return String(aValue).localeCompare(String(bValue));
        }
    });
}

function sortDesc(arr, property) {
    return arr.slice().sort((a, b) => {
        const aValue = a[property];
        const bValue = b[property];
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return bValue - aValue;
        } else {
            return String(bValue).localeCompare(String(aValue));
        }
    });
}

function sum(arr, property) {
    return arr.reduce((total, obj) => total + (+obj[property] || 0), 0);
}

RS.Array = (data = []) => {
    return {
        unique: () => getUniqueValues(data),
        encodeUri: () => encodeURIComponent(JSON.stringify(data)),
        where: (property, value) => where(data, property, value),
        andWhere: (property, value) => where(data, property, value),
        first: () => first(data),
        last: () => last(data),
        like: (property, value) => like(data, property, value),
        andLike: (property, value) => like(data, property, value),
        indexOfProperty: (property, value) => data.indexOf(where(data, property, value)[0]),
        sortAsc: property => sortAsc(data, property),
        sortDesc: property => sortDesc(data, property),
        sum: property => sum(data, property),
    }
}