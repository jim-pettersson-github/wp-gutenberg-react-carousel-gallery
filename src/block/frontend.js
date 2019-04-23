const { render } = wp.element;
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import GalleryContainer from './components/GalleryContainer';

const client = new ApolloClient({
});

const App = ({ element }) => (
  <ApolloProvider client={client}>
    <GalleryContainer element={element} />
  </ApolloProvider>
);

window.addEventListener('DOMContentLoaded', () => {
  const galleries = document.querySelectorAll('.jp-guten-block-gallery-fe-container');

  // https://github.com/zgordon/advanced-gutenberg-course/blob/80874b226b9c26f353d76a87e3ec0cc79dc99db0/blocks/01-gallery/frontend.js
  galleries.forEach((gallery) => {
    render(
      <App element={gallery} />,
      gallery
    );
  });
  // PRELOAD IMAGES..
  // #1 - alternativ
  // componentDidMount() {
  //   this.props.pictures.forEach((picture) => {
  //       const img = new Image();
  //       img.src = picture.fileName;
  //   });
  // }

  // #2 - alternativ
  // componentDidMount() {
  //   const img = new Image();
  //   img.src = Newman; // by setting an src, you trigger browser download
  //
  //   img.onload = () => {
  //     // when it finishes loading, update the component state
  //     this.setState({ imageIsReady: true });
  //   }
  // }
  //
  // render() {
  //   const { imageIsReady } = this.state;
  //
  //   if (!imageIsReady) {
  //     return <div>Loading image...</div>; // or just return null if you want nothing to be rendered.
  //   } else {
  //     return <img src={Newman} /> // along with your error message here
  //   }
  // }

  // https://github.com/WordPress/gutenberg/blob/master/packages/element/README.md
  // Just like => ReactDOM.render(<App />, document.getElementById('root'));
});
