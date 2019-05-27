const { render } = wp.element;
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import GalleryContainer from './components/GalleryContainer';

const client = new ApolloClient({
  cache: new InMemoryCache(),
});

const App = ({ element }) => (
  <ApolloProvider client={client}>
    <GalleryContainer element={element} />
  </ApolloProvider>
);

window.addEventListener('DOMContentLoaded', () => {
  const galleries = document.querySelectorAll('.jp-guten-block-gallery-fe-container');
  galleries.forEach((gallery) => {
    render(
      <App element={gallery} />,
      gallery
    );
  });
});
