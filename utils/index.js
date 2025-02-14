
import { DateTime } from 'luxon';

export function getLocalizedMonth(monthNumber, options = { length: 'short', locale: 'en' }) {
    const { length, locale } = options;
    const locales = ['en', 'ar', 'es', 'fr', 'ru', 'zh'];

    if (!locales.includes(locale)) {
        throw new Error(`Locale ${locale} is not supported. Supported locales are: ${locales.join(', ')}`);
    }

    const month = DateTime.fromObject({ month: monthNumber }).setLocale(locale);

    if (length === 'long') {
        return month.toFormat('LLLL');
    } else {
        return month.toFormat('LLL');
    }
}

export function sortArrayOfObjectsByProp(a,b, prop, direction = 'asc'){
    const isAsc = direction === 'asc';

    if(a[prop] < b[prop]) return isAsc? 1 : -1; 
    if(a[prop] > b[prop]) return isAsc? -1 : 1; 

    return 0;
}

export function getParentPath(path) {
    if (!path || typeof path !== 'string') return path;

    const segments                    = path.split('/').filter(Boolean);
    const localesToRemoveFirstSegment = ['ar', 'es', 'fr', 'ru', 'zh'];
    
    if (segments.length > 0 && localesToRemoveFirstSegment.includes(segments[0]))
        segments.shift();

    if ([0,1].includes(segments.length) ) return '';
    
    // Remove the last segment
    if (segments.length > 0) segments.pop();

    return segments.length? '/'+segments.join('/'): '/';
}

export function getPath(adminTags=[]){
    const tags   = adminTags.filter(tag=> tag !=='ebsa-portal').filter(Boolean);
    const counts = [];

    for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];

        counts.push([tag, tag.split('/').filter(Boolean)]);
    }

    const sorted = counts.sort((a,b)=> b[1].length - a[1].length);
    return sorted[0][0];
}

export const shuffle = ([...arr]) => {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  };

export const sampleMultiple = ([...arr], n = 0) => shuffle(arr).slice(0, n || Math.floor(Math.random() * arr.length));