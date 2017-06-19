(require 'package)

(add-to-list 'package-archives '("melpa" . "http://melpa.org/packages/"))
(add-to-list 'package-archives '("gnu" . "http://elpa.gnu.org/packages/"))

(package-initialize)

;(require 'auto-complete)
;(ac-config-default)

;(require 'yasnippet)
;(yas-global-mode 1)
		 
(require 'flycheck)
(global-flycheck-mode)

(require 'company)
(global-company-mode)

(require 'company-irony)
(require 'company-irony-c-headers)
(require 'flycheck-irony)
(require 'irony-eldoc)

(load-theme 'atom-one-dark t)

(add-hook 'after-init-time 'global-company-mode)

(add-hook 'c++-mode-hook  'irony-mode)
(add-hook 'c-mode-hook    'irony-mode)
(add-hook 'objc-mode-hook 'irony-mode)

(add-hook 'irony-mode-hook 'irony-cdb-autosetup-compile-options)

(eval-after-load 'company
  '(add-to-list
    'company-backends '(company-irony-c-headers company-irony)))

(eval-after-load 'flycheck
  '(add-hook 'flycheck-mode-hook #'flycheck-irony-setup))

(add-hook 'irony-mode-hook #'irony-eldoc)

(setq-default c-basic-offset 4
	      tab-width 4
	      indent-tabs-mode t
		  irony-eldoc
		  eldoc-mode)

(electric-pair-mode 1) ; auto-complete closing brackets

(semantic-mode 1)

(menu-bar-mode     -1) ;
(toggle-scroll-bar -1) ;; hide stuff
(tool-bar-mode     -1) ;

(column-number-mode 1) ; show column # in bottom toolbar

(delete-selection-mode 1) ; delete selected when typed over

(set-frame-parameter (selected-frame) 'alpha '(85 . 85))

(define-key global-map (kbd "C-,") 'iedit-mode)
(define-key global-map (kbd "C-.") 'company-complete)

(global-set-key [M-up] 'move-text-up)
(global-set-key [M-down] 'move-text-down)

(defun move-text-internal (arg)
  (cond
   ((and mark-active transient-mark-mode)
    (if (> (point) (mark))
        (exchange-point-and-mark))
    (let ((column (current-column))
          (text (delete-and-extract-region (point) (mark))))
      (forward-line arg)
      (move-to-column column t)
      (set-mark (point))
      (insert text)
      (exchange-point-and-mark)
      (setq deactivate-mark nil)))
   (t
    (let ((column (current-column)))
      (beginning-of-line)
      (when (or (> arg 0) (not (bobp)))
        (forward-line)
        (when (or (< arg 0) (not (eobp)))
          (transpose-lines arg))
        (forward-line -1))
      (move-to-column column t)))))

(defun move-text-down (arg)
  "Move region (transient-mark-mode active) or current line
  arg lines down."
  (interactive "*p")
  (move-text-internal arg))

(defun move-text-up (arg)
  "Move region (transient-mark-mode active) or current line
  arg lines up."
  (interactive "*p")
  (move-text-internal (- arg)))
(provide 'move-text)

(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(custom-safe-themes
   (quote
	("08b8807d23c290c840bbb14614a83878529359eaba1805618b3be7d61b0b0a32" default)))
 '(package-selected-packages
   (quote
	(irony-eldoc flycheck-irony company-irony-c-headers company-irony company-c-headers company atom-one-dark-theme flycheck iedit auto-complete-c-headers yasnippet auto-complete))))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
