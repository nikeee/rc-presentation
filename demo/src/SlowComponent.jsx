export default function SlowComponent() {
    const now = Date.now();
    while (Date.now() < (now + 10));
    return <div>Ich bin langsam</div>;
}