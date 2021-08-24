export default function authHeaderForCSV() {
    const token = localStorage.getItem('token');
    if (token) {
        return { 'Content-Type': 'text/csv'};
    } else {
        return {};
    }
}