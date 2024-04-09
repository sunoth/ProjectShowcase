import './index.css'

const ProjectCard = props => {
  const {projectDetails} = props
  const {id, name, imageUrl} = projectDetails

  return (
    <li key={id} className="project-card-container">
      <img src={imageUrl} alt={name} className="project-image" />
      <p className="project-name">{name}</p>
    </li>
  )
}

export default ProjectCard
