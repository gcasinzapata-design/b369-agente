import FilterForm from "../components/FilterForm";
import Chat from "../components/Chat";
export default function Page(){return (<div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:16}}><div><FilterForm/></div><div><Chat/></div></div>);}
