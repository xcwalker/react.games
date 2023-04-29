import "../../style/components/loading.css"

export function Page_Loading () {
    return <>
        <section className="loading">
            <div className="container">
                <h1>Loading</h1>
                <div className="dot-flashing" />
            </div>
        </section>
    </>
}