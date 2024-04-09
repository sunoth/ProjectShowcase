import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import ProjectCard from '../ProjectCard'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectsShowcase extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    selectedCategory: categoriesList[0].id,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjects()
  }

  onChangeCategory = event => {
    this.setState({selectedCategory: event.target.value}, () =>
      this.getProjects(),
    )
  }

  getProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {selectedCategory} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${selectedCategory}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data.projects)
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetry = () => {
    this.getProjects()
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#00bfff" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state

    return (
      <ul className="success-container">
        {projectsList.map(eachProject => (
          <ProjectCard key={eachProject.id} projectDetails={eachProject} />
        ))}
      </ul>
    )
  }

  renderProjects = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  render() {
    const {selectedCategory} = this.state

    return (
      <div>
        <Header />
        <select
          value={selectedCategory}
          className="select-container"
          onChange={this.onChangeCategory}
        >
          {categoriesList.map(eachCategory => (
            <option value={eachCategory.id} key={eachCategory.id}>
              {eachCategory.displayText}
            </option>
          ))}
        </select>
        {this.renderProjects()}
      </div>
    )
  }
}

export default ProjectsShowcase
