import './index.css'
import {BiSearch} from 'react-icons/bi'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    onChangeSearchInput,
    searchInput,
    onClickCategory,
    onClickRating,
    OnclickClearFilter,
    onEntered,
  } = props

  const handleEnterKey = e => {
    if (e.key === 'Enter') {
      onEntered()
    }
  }
  return (
    <div className="filters-group-container">
      <div className="search-wrap">
        <input
          type="search"
          placeholder="Search"
          className="input-search"
          onChange={e => onChangeSearchInput(e)}
          value={searchInput}
          onKeyDown={e => handleEnterKey(e)}
        />
        <BiSearch className="search-icon" />
      </div>

      <div className="category-wrap">
        <h1 className="side-head">Category</h1>
        {categoryOptions.map(eachCategory => (
          <button
            type="button"
            className="li-btn"
            key={eachCategory.categoryId}
            onClick={() => onClickCategory(eachCategory.categoryId)}
          >
            <p>{eachCategory.name}</p>
          </button>
        ))}
      </div>

      <div className="category-wrap">
        <h1 className="side-head">Rating</h1>
        {ratingsList.map(eachRating => (
          <button
            type="button"
            className="li-btn"
            key={eachRating.ratingId}
            onClick={() => onClickRating(eachRating.ratingId)}
          >
            <img
              src={eachRating.imageUrl}
              alt={`rating ${eachRating.ratingId}`}
              className="rating-img"
            />
            & up
          </button>
        ))}
      </div>

      <button
        type="button"
        className="main-filter-button"
        onClick={() => OnclickClearFilter()}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
