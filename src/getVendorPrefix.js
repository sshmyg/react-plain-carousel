export default function getVendorPrefix() {
    const styles = window.getComputedStyle(document.documentElement, '');
    const res = Array.prototype.slice
                    .call(styles)
                    .join('')
                    .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']);

    return res ? res[1] : res;
}
