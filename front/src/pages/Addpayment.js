import Header from "../components/Header";

export default function Addpayment() {
    return (
        <>
            <Header title="Addpayment Management" />
            <Content />
        </>
    );
}

function Content() {
    return (
        <div className="p-4">
            <h1>Add Payment</h1>
        </div>
    );
}
