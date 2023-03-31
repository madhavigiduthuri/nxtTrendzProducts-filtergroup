import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatus = {
  inprogress: 'inprogress',
  success: 'success',
  failure: 'failure',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    // isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    searchInput: '',
    selectedCategory: '',
    selectedRating: '',
    apiState: apiStatus.success,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      // isLoading: true,
      apiState: apiStatus.inprogress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied
    const {
      activeOptionId,
      searchInput,
      selectedCategory,
      selectedRating,
    } = this.state
    // const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}`
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${selectedCategory}&title_search=${searchInput}&rating=${selectedRating}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        // isLoading: false,
        apiState: apiStatus.success,
      })
    } else {
      this.setState({
        // isLoading: false,
        apiState: apiStatus.failure,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        {productsList.length > 0 ? (
          <>
            <ProductsHeader
              activeOptionId={activeOptionId}
              sortbyOptions={sortbyOptions}
              changeSortby={this.changeSortby}
            />
            <ul className="products-list">
              {productsList.map(product => (
                <ProductCard productData={product} key={product.id} />
              ))}
            </ul>
          </>
        ) : (
          <div className="no-products-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
              alt="no products"
              // className="no-products"
            />
            <h1>No Products Found</h1>
            <p>We could not find any products. Try other filters</p>
          </div>
        )}
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  renderFailure = () => (
    <div className="all-products-container">
      <div className="no-products">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
          alt="products failure"
          // className="no-products"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>
          We are facing some trouble processing your request. Please try again
        </p>
      </div>
    </div>
  )

  renderProductsData = () => {
    const {apiState} = this.state
    // if (apiState === apiStatus.success) {
    //   return this.renderProductsList()
    // }
    // if (apiState === apiStatus.failure) {
    //   return this.renderFailure()
    // }
    // if (apiState === apiStatus.inprogress) {
    //   return this.renderLoader()
    // }
    // return null

    switch (apiState) {
      case apiStatus.success:
        return this.renderProductsList()
      case apiStatus.inprogress:
        return this.renderLoader()
      case apiStatus.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  onChangeSearchInput = e => {
    this.setState({searchInput: e.target.value})
  }

  onEntered = () => {
    this.getProducts()
  }

  onClickCategory = id => {
    this.setState({selectedCategory: id}, this.getProducts)
  }

  onClickRating = id => {
    this.setState({selectedRating: id}, this.getProducts)
  }

  OnclickClearFilter = () => {
    this.setState(
      {selectedCategory: '', selectedRating: '', searchInput: ''},
      this.getProducts,
    )
  }

  render() {
    const {searchInput} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          onChangeSearchInput={this.onChangeSearchInput}
          searchInput={searchInput}
          onClickCategory={this.onClickCategory}
          onClickRating={this.onClickRating}
          OnclickClearFilter={this.OnclickClearFilter}
          onEntered={this.onEntered}
        />

        {this.renderProductsData()}
      </div>
    )
  }
}

export default AllProductsSection
