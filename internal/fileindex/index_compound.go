package fileindex

import (
	"fmt"
)

type compound struct {
	id   string
	name string
	idxs map[string]Index
}

type compoundEntry struct {
	e        Entry
	parentId string
}

func (e *compoundEntry) Id() string {
	return e.e.Id()
}

func (e *compoundEntry) Name() string {
	return e.e.Name()
}

func (e *compoundEntry) IsDir() bool {
	return e.e.IsDir()
}

func (e *compoundEntry) Path() string {
	return e.e.Path()
}

func (e *compoundEntry) ParentId() string {
	return e.parentId
}

func NewCompound(id string, name string, indexes ...Index) Index {
	idxs := make(map[string]Index)
	for _, idx := range indexes {
		idxs[idx.Id()] = idx
	}
	return &compound{id, name, idxs}
}

func (i *compound) Id() string {
	return i.id
}

func (i *compound) Name() string {
	return i.name
}

func (i *compound) Root() string {
	return "**compound index**"
}

func (i *compound) Get(id string) (Entry, error) {
	if id == "" {
		return nil, fmt.Errorf("Can not get entry for empty path")
	}
	if idx := i.idxs[id]; idx != nil {
		return &entry{idx.Id(), idx.Name(), "", true, ""}, nil
	}
	entry, idx, err := i.get(id)
	if err != nil {
		return nil, err
	}
	return i.transform(idx, entry), nil
}

func (i *compound) WaitForReady() error {
	for _, idx := range i.idxs {
		if err := idx.WaitForReady(); err != nil {
			return err
		}
	}
	return nil
}

func (i *compound) List(parent string) ([]Entry, error) {
	if parent == "" {
		result := make([]Entry, 0)
		for _, idx := range i.idxs {
			result = append(result, &entry{idx.Id(), idx.Name(), "", true, ""})
		}
		return result, nil
	}
	var (
		idx Index
		err error
	)
	if idx = i.idxs[parent]; idx != nil {
		parent = ""
	} else {
		_, idx, err = i.get(parent)
	}

	if err != nil {
		return nil, err
	}
	list, err := idx.List(parent)
	if err != nil {
		return nil, err
	}
	for j, e := range list {
		list[j] = i.transform(idx, e)
	}
	return list, nil
}

func (i *compound) get(id string) (Entry, Index, error) {
	for _, idx := range i.idxs {
		entry, err := idx.Get(id)
		if err != nil {
			return nil, idx, err
		}
		if entry != nil {
			return entry, idx, nil
		}
	}
	return nil, nil, nil
}

func (i *compound) transform(idx Index, e Entry) Entry {
	if e.ParentId() == "" {
		return &compoundEntry{e, idx.Id()}
	}
	return e
}
