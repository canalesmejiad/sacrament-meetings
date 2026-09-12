export default function Footer() {
    return (
        <footer className="mt-auto bg-slate-900 px-6 py-5 text-center text-sm text-slate-300">
            <p>
                &copy; {new Date().getFullYear()} Sacrament Meeting Planner
            </p>
        </footer>
    );
}