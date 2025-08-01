import NoVNC from './mynovnc';

export default function VncPage() {
  return (
    <div style={{ height: '100vh' }}>
      <NoVNC host="10.21.78.250" port="5902" password='ubuntu'/>
    </div>
  );
}