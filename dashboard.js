async function loginUser() {
  const id = document.getElementById('loginId').value;
  const password = document.getElementById('loginPassword').value;

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, password })
  });

  const data = await res.json();
  if (res.ok) {
    // Login OK → redireciona
    window.location.href = '/dashboard';
  } else {
    alert(data.message);
  }
}
