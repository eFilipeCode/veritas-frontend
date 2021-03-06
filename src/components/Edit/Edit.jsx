import React, { useState } from 'react';
import '../Quote/Quote.css';
import Header from '../Header/Header.jsx';
import api from '../../services/api.js';
import { useHistory } from 'react-router-dom';
import verifyAdmLogin from '../../utils/verifyAdmLogin';
import FailedScreen from '../FailedScreen/FailedScreen.jsx';

function Edit({ location }) {
    const [content, setContent] = useState(location.state.post.content);
    const [id] = useState(location.state.post._id);
    const [title, setTitle] = useState(location.state.post.title);
    const [desc, setDesc] = useState(location.state.post.description);
    const [category, setCategory] = useState(location.state.post.category);
    const [time, setTime] = useState(null);
    const [thumb, setThumb] = useState(location.state.post.thumbPath);
    const [author, setAuthor] = useState(location.state.post.author);
    const [step, setStep] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verified, setVerified] = useState(false);
    const [logged, setLogged] = useState(false);
    const [archived, setArchived] = useState(true);


    const history = useHistory();

    function setContentAndTarget(e) {
        setContent(e.target.value);
        debounce(e.target.value);
    };

    async function post() {
        if (!verified) return alert('O usuário não foi verificado');

        const data = {
            id,
            title,
            description: desc,
            content,
            thumbPath: thumb,
            author,
            category
        };

        await api.post('update', data)
            .then(res => history.push('/'));
    };

    (async function verifyLogged() {
        const logged = await verifyAdmLogin();
        setLogged(logged);
    })();

    async function verify() {
        const dataLogin = {
            email,
            password,
        };
        try {
            const response = await api.post('login', dataLogin);
            setAuthor(response.data.name);
            setVerified(true);
            post();
        } catch (error) {
            alert(error);
        };
    };

    function debounce(value) {
        const target = document.querySelector('.target-update');
        clearTimeout(time);

        setTime(setTimeout(() => {
            target.innerHTML = value;
        }, 50));
    };

    function addQuoteInContent() {
        const target = document.querySelector('.target-update');
        const quoteContainer = `
    <div class="quote-container">
    <div class="quote">
        <p></p>
    </div>
    <div class="author">
        <p><i></i></p>
    </div>
    </div>
    `;
        target.innerHTML = setContent(`${content + quoteContainer}`);
    };

    return (
        <div>
            {
                logged ?
                    <div className="new-post-container">
                        <Header />
                        <div className="input-group">
                            <form onSubmit={(e) => e.preventDefault()} style={step ? { display: 'none' } : { display: 'flex' }}>
                                <div className="title-thumb">
                                    <input value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="Título" className="input-title" maxLength={25} /> <span>{title.length}/25</span>
                                    <div className="thumb-controller">
                                        <div className="color-overlay"></div>
                                        <input value={thumb} onChange={e => setThumb(e.target.value)} type="text" className="thumb-path" />
                                        <img src={thumb} alt="Thumb" className="thumb" />
                                    </div>
                                </div>
                                <input maxLength={150} value={desc} onChange={e => setDesc(e.target.value)} type="text" placeholder="Descrição" className="input-description" /> <span>{desc.length}/150</span>
                                <div className="textarea-container">
                                    <div className="textarea-options">
                                        <button onClick={() => addQuoteInContent()}>""</button>
                                    </div>
                                    <textarea value={content} onChange={e => setContentAndTarget(e)} type="text" placeholder="Conteúdo" className="textarea-content"></textarea>
                                </div>
                                <div className="target-container">
                                    <p className="target-update">
                                        Prévia do conteúdo virá aqui. Não se esqueça de passar o estilo in-line.
                                    </p>
                                </div>
                                <input value={category} maxLength={25} onChange={e => setCategory(e.target.value)} type="text" className="input-category" placeholder="Category" /> <span>{category.length}/25</span>
                                <div>
                                Rascunho: <input type="checkbox" checked={archived} onChange={e => setArchived(e.target.checked)}/>
                                </div>
                                <button onClick={e => {
                                    e.preventDefault();
                                    setStep(true);
                                }} type="submit">Enviar</button>
                            </form>
                        </div>
                        <div className="login-step" style={step ? { display: 'flex' } : { display: 'none' }}>
                            <input value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder="Email" className="email-input" />
                            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Senha" className="password-input" />
                            <button onClick={() => verify()}>Verificar</button>
                        </div>
                    </div> :
                    <FailedScreen />
            }
        </div>
    );
};

export default Edit;