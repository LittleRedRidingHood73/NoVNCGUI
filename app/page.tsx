import NoVNC from './mynovnc';

export default function VncPage() {
  return (
    <div style={{ height: '100vh' }}>
      <NoVNC host="10.21.78.108" port="5901" password='adios'/>
    </div>
  );
}