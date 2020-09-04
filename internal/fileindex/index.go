package fileindex

type Entry interface {
	Id() string
	Name() string
	IsDir() bool
	Path() string
	ParentId() string
}

type Index interface {
	Id() string
	Name() string
	Root() string
	Get(id string) (Entry, error)
	WaitForReady() error
	List(parent string) ([]Entry, error)
}

type entry struct {
	id       string
	name     string
	path     string
	isDir    bool
	parentId string
}

func (e *entry) Id() string {
	return e.id
}

func (e *entry) Name() string {
	return e.name
}

func (e *entry) IsDir() bool {
	return e.isDir
}

func (e *entry) Path() string {
	return e.path
}

func (e *entry) ParentId() string {
	return e.parentId
}

type Entries []Entry

func (es Entries) Len() int {
	return len(es)
}

func (es Entries) Less(i, j int) bool {
	return es[i].Name() < es[j].Name()
}

func (es Entries) Swap(i, j int) {
	es[i], es[j] = es[j], es[i]
}
